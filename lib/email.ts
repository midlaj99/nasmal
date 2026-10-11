import tls from 'tls';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Enterprise pure Node.js TLS SMTP Client for Gmail.
 * Zero external dependencies. Fast, robust, and secure.
 */
export async function sendMail({ to, subject, html, text }: SendMailOptions): Promise<{ success: boolean; messageId?: string }> {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = (process.env.SMTP_USER || 'nasmaltourism@gmail.com').trim();
  const rawPass = process.env.SMTP_PASS || 'swvg hhhy tgwv eigq';
  const pass = rawPass.replace(/\s+/g, '').trim();

  return new Promise((resolve, reject) => {
    let socket: tls.TLSSocket | null = null;
    let step = 0;
    let responseBuffer = '';

    const timer = setTimeout(() => {
      if (socket) {
        socket.destroy();
      }
      reject(new Error('SMTP connection timed out after 12 seconds'));
    }, 12000);

    const cleanup = () => {
      clearTimeout(timer);
      if (socket && !socket.destroyed) {
        socket.end();
      }
    };

    try {
      socket = tls.connect(
        {
          host,
          port,
          rejectUnauthorized: true,
          servername: host,
        },
        () => {
          // Connected securely via TLS
        }
      );
    } catch (err) {
      cleanup();
      return reject(err);
    }

    socket.setEncoding('utf8');

    socket.on('data', (data: string) => {
      responseBuffer += data;

      // Handle multiline responses (e.g. 250-xxx followed by 250 xxx)
      const lines = responseBuffer.trim().split('\n');
      const lastLine = lines[lines.length - 1] || '';

      // SMTP reply codes are 3 digits followed by space or hyphen
      const codeMatch = lastLine.match(/^(\d{3})(?:[ -]|$)/);
      if (!codeMatch) return;

      // Check if it's a multiline response continuation (e.g. '250-')
      if (lastLine.charAt(3) === '-') return;

      const code = parseInt(codeMatch[1], 10);
      responseBuffer = ''; // Reset buffer for next step

      const sendCommand = (cmd: string) => {
        if (socket && !socket.destroyed) {
          socket.write(cmd + '\r\n');
        }
      };

      try {
        switch (step) {
          case 0: // Expect 220 banner
            if (code !== 220) throw new Error(`Unexpected SMTP banner: ${lastLine}`);
            step = 1;
            sendCommand(`EHLO localhost`);
            break;

          case 1: // Expect 250 after EHLO
            if (code !== 250) throw new Error(`EHLO rejected: ${lastLine}`);
            step = 2;
            sendCommand('AUTH LOGIN');
            break;

          case 2: // Expect 334 for username prompt
            if (code !== 334) throw new Error(`AUTH LOGIN rejected: ${lastLine}`);
            step = 3;
            sendCommand(Buffer.from(user).toString('base64'));
            break;

          case 3: // Expect 334 for password prompt
            if (code !== 334) throw new Error(`Username rejected: ${lastLine}`);
            step = 4;
            sendCommand(Buffer.from(pass).toString('base64'));
            break;

          case 4: // Expect 235 Authentication successful
            if (code !== 235) throw new Error(`Authentication failed (${code}): ${lastLine}. Check Google App Password.`);
            step = 5;
            sendCommand(`MAIL FROM:<${user}>`);
            break;

          case 5: // Expect 250 OK after MAIL FROM
            if (code !== 250) throw new Error(`MAIL FROM rejected: ${lastLine}`);
            step = 6;
            sendCommand(`RCPT TO:<${to}>`);
            break;

          case 6: // Expect 250 OK after RCPT TO
            if (code !== 250) throw new Error(`RCPT TO rejected: ${lastLine}`);
            step = 7;
            sendCommand('DATA');
            break;

          case 7: // Expect 354 Start mail input
            if (code !== 354) throw new Error(`DATA rejected: ${lastLine}`);
            step = 8;

            const messageId = `<${Date.now()}.${Math.random().toString(36).substring(2)}@nasmaltourism.com>`;
            const emailHeaders = [
              `From: "Nasmal Tourisms Security" <${user}>`,
              `To: <${to}>`,
              `Subject: ${subject}`,
              `Message-ID: ${messageId}`,
              `Date: ${new Date().toUTCString()}`,
              `MIME-Version: 1.0`,
              `Content-Type: text/html; charset=UTF-8`,
              `Content-Transfer-Encoding: 8bit`,
              '',
              html || text || '',
              '.',
            ].join('\r\n');

            sendCommand(emailHeaders);
            break;

          case 8: // Expect 250 OK Message accepted
            if (code !== 250) throw new Error(`Message body rejected: ${lastLine}`);
            step = 9;
            sendCommand('QUIT');
            cleanup();
            resolve({ success: true, messageId: lastLine });
            break;

          default:
            break;
        }
      } catch (err: any) {
        cleanup();
        reject(err);
      }
    });

    socket.on('error', (err) => {
      cleanup();
      reject(err);
    });

    socket.on('end', () => {
      if (step < 8) {
        cleanup();
        reject(new Error('SMTP connection closed prematurely by server'));
      }
    });
  });
}
