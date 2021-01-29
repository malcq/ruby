class NotificationsMailer < ApplicationMailer
  def mailer(instance)
    @instance = instance
    mail(to: @instance.user.email, subject: 'Sample Email')
  end
end
