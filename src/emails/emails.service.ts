// email.service.ts

import { Injectable } from '@nestjs/common';
import * as Imap from 'imap';
import { simpleParser } from 'mailparser';

@Injectable()
export class EmailService {
  private imap: Imap;

  constructor() {
    this.imap = new Imap({
      user: process.env.AUTH_EMAIL,
      password: process.env.AUTH_PASSWORD,
      host: process.env.AUTH_IMAP_SERVER,
      port: 993,
      tls: true,
    });
  }

  async fetchAllEmails(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => {
        this.imap.openBox('INBOX', true, (err, box) => {
          if (err) {
            reject(err);
            return;
          }

          const allMessages = [];

          const fetch = this.imap.seq.fetch('1:*', { bodies: [''] });

          fetch.on('message', (msg, seqno) => {
            const message: any = {};

            msg.on('body', (stream) => {
              simpleParser(stream, async (err, parsed) => {
                if (err) {
                  reject(err);
                  return;
                }

                message.subject = parsed.subject;
                message.from = parsed.from.text;
                message.to = parsed.to.text;
                message.date = parsed.date;
                message.text = parsed.text;
                message.html = parsed.html;

                allMessages.push(message);
              });
            });

            msg.once('attributes', (attrs) => {
              message.flags = attrs.flags;
            });
          });

          fetch.once('end', () => {
            this.imap.end();
            resolve(allMessages);
          });
        });
      });

      this.imap.once('error', (err) => {
        reject(err);
      });

      this.imap.connect();
    });
  }
}
