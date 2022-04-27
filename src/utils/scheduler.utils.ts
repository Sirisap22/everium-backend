import cron from 'node-cron'
import UserRole from '../users/user-role.enum';
import userModel from '../users/user.model';

export function scheduleResetUserUsedPromotePostsEveryFirstDayOfMonth() {
  cron.schedule('0 0 1 * *', async () => {
    console.log('Running a job at 12:00 AM (Asia/Thailand timezone)')
    await userModel.updateMany({ role: UserRole.Seller }, { usedPromote: 0 });
  }, {
    timezone: 'Asia/Bangkok'
  });
}
