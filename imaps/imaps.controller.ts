import { Controller, Get } from '@nestjs/common';
import { MailMessage, EmailData } from './interfaces/mail-message.interface';
import { ImapsService } from './imaps.service';
import * as he from 'he';

@Controller('imaps')
export class ImapsController {
  constructor(private readonly imapService: ImapsService) {}

  @Get('fetch')
  async fetchEmails() {
    //: Promise<MailMessage[]> {
    await this.imapService.connect();
    const searchCriteria = ['SEEN']; // You can customize the search criteria
    let msgs = await this.imapService.searchAndFetch(searchCriteria);
    let data = [];

    const unseenMails = msgs.forEach((msg) => {
      data.push(this.extractEmailData(msg.body));
    });
    
    console.log(data.length);
    return data;
  }

  extractEmailData(emailString: string): EmailData {
    if (!emailString || typeof emailString !== 'string') {
      throw new Error('Invalid email string');
    }

    const headersPattern = /^([\w-]+:\s*.*?)(?:\r\n|\r|\n|$)/gm;
    const headersMatch = emailString.match(headersPattern);

    const headers: EmailData = {};
    if (headersMatch) {
      for (const header of headersMatch) {
        const [name, value] = header.split(/:\s*/, 2);
        headers[name] = value.trim();
      }
    }

    const contentPattern = /\r\n\r\n([\s\S]*)$/;
    const contentMatch = emailString.match(contentPattern);

    let content = '';
    if (contentMatch && contentMatch[1]) {
      content = contentMatch[1];
    }

    const extractedData: EmailData = {
      ReturnPath: headers['Return-Path'],
      DeliveredTo: headers['Delivered-To'],
      From: headers['From'],
      To: headers['To'],
      Cc: headers['Cc'],
      Subject: headers['Subject'],
      Date: headers['Date'],
      MessageID: headers['Message-ID'],
      Content: this.extractTextFromEmailBody(content),
    };

    return extractedData;
  }
  extractTextFromEmailBody(emailBody: string): string {
    const textRegex =
      /Content-Type: text\/plain;.*\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n([\s\S]+)\r\n\r\n--/;
    const match = emailBody.match(textRegex);

    if (match && match.length > 1) {
      const text = match[1];
      // Convert the quoted-printable encoding to plain text
      const decodedText = this.decodeQuotedPrintable(text);
      // Convert any special characters to their proper UTF-8 representation
      const utf8Text = this.decodeUtf8(decodedText);
      const normalText = this.decodeText(utf8Text);
        // Remove any non-ASCII characters
        return this.removeNonASCIICharacters(normalText);
    
    }

    return '';
  }
  decodeUtf8(text: string): string {
    return text.replace(/=([A-Fa-f0-9]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
  }
  decodeText(text: string): string {
    return he.decode(text);
  }
  removeNonASCIICharacters(text: string): string {
    return text.replace(/[^\x00-\x7F]/g, '');
  }
  // Helper function to decode quoted-printable text
  decodeQuotedPrintable(text: string): string {
    return text
      .replace(/=3D/g, '=') // Replace =3D with =
      .replace(/=([A-F0-9]{2})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      ) // Convert hex to character
      .replace(/=\r\n/g, ''); // Remove line breaks used in quoted-printable encoding
  }
}
