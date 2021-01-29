const { updateAllUsersConversationId } = require('./slackBot/usersData');

console.log('Начинаем обновление Slack id каналов staff и CRM...');

updateAllUsersConversationId()
  .then((result) => {
    if (result) {
      console.log('Обновление завершилось успешно');
      process.exit();
    } else {
      console.error('Обновление завершилось с ошибкой');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error(`Обновление завершилось с ошибкой ${error.message}`);
    process.exit(1);
  });
