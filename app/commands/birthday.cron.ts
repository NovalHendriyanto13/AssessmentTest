import cron from 'node-cron';
import moment from 'moment-timezone';
import { UserModel } from '../models/users.model';
import { sendEmail } from '../services/common.service';

export function scheduleBirthday() {
  cron.schedule('* * * * *', async () => {
    console.log('Checking birthdays...');
    const users = await UserModel.find();

    for (const user of users) {
    //   if (!isBirthdayToday(user.birthday, user.timezone)) continue;
    //   if (!isNineAM(user.timezone)) continue;
    //   if (user.lastSentYear === new Date().getFullYear()) continue;

      const emailBody = `Hi ${user.firstName} ${user.lastName}, Happy Birthday to You`;
      const sent = await sendEmail(emailBody, user.email);
      if (sent) {
        user.lastSentYear = new Date().getFullYear();
        await user.save();
      }
    }
  });
}

export function isBirthdayToday(birthday: string, timezone: string): boolean {
  const today = moment().tz(timezone).format('MM-DD');
  return birthday.slice(5) === today;
}

export function isNineAM(timezone: string): boolean {
  const now = moment().tz(timezone);
  return now.hour() === 9 && now.minute() === 0;
}