import { model, Schema } from 'mongoose';
import RefreshToken from './refresh-token.interface';

const refreshTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true },
  issued: { type: Date, required: true },
  revoked: { type: Date },
  replacedByToken: { type: String }
});

refreshTokenSchema.virtual('isExpired').get(function (this: { expires: Date }) {
  return new Date() >= this.expires;
});

refreshTokenSchema.virtual('isActive').get(function (this: { revoked: Date; isExpired: boolean }) {
  return !this.revoked && !this.isExpired;
});

refreshTokenSchema.set('toJSON', {
  virtuals: true
});

const refreshTokenModel = model<RefreshToken>('RefreshToken', refreshTokenSchema);

export default refreshTokenModel;