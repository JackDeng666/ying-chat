import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { createTransport, Transporter } from 'nodemailer'
import { emailConfig } from '@/config'

@Injectable()
export class EmailService {
  transporter: Transporter

  constructor(
    @Inject(emailConfig.KEY)
    private readonly emConfig: ConfigType<typeof emailConfig>
  ) {
    this.transporter = createTransport({
      host: this.emConfig.host,
      port: this.emConfig.port,
      auth: {
        user: this.emConfig.user,
        pass: this.emConfig.code
      }
    })
  }

  async sendMail(email: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: this.emConfig.user,
      to: email,
      subject,
      html
    })
  }
}
