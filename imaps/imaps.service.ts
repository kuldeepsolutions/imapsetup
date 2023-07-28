import { Injectable } from '@nestjs/common';
import * as Imap from 'node-imap';

import { MailMessage } from './interfaces/mail-message.interface';
@Injectable()
export class ImapsService {
  private imap: any;

  constructor() {
    // Configure the IMAP connection here
    this.imap = new Imap({
      user: process.env.AUTH_EMAIL,
      password: process.env.AUTH_PASSWORD,
      host: process.env.AUTH_IMAP_SERVER,
      port: +process.env.AUTH_IMAP_PORT,
      tls: true,
    });
  }
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => {
        resolve();
      });

      this.imap.once('error', (err: any) => {
        reject(err);
      });

      this.imap.connect();
    });
  }
  searchAndFetch(searchCriteria: any): Promise<MailMessage[]> {
    return new Promise((resolve, reject) => {
      this.imap.openBox('INBOX', true, (err: any) => {
        if (err) {
          reject(err);
        } else {
          this.imap.search(searchCriteria, (err: any, results: any) => {
            if (err) {
              reject(err);
            } else {
              const fetch = this.imap.fetch(results, { bodies: '' });
              const mailMessages: MailMessage[] = [];

              fetch.on('message', (msg: any) => {
                msg.on('body', (stream: any, info: any) => {
                  // console.log("==============================================================")
                  // console.log(info)
                  // console.log("==============================================================")
                  let buffer = '';
                  stream.on('data', (chunk: any) => {
               
                    buffer += chunk.toString('utf8');
                  });

                  stream.on('end', () => {
                    
                    mailMessages.push({
                     
                      body: buffer,
                    });
                  });
                });
              });

              fetch.once('end', () => {
                resolve(mailMessages);
              });

              fetch.once('error', (fetchErr: any) => {
                reject(fetchErr);
              });
            }
          });
        }
      });
    });
  }
}
