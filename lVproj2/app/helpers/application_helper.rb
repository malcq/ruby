module ApplicationHelper
  def date_formatter(time)
    time.strftime('%a %M %B %Y')
  end
end
