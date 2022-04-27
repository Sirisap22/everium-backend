import multer, { Options } from 'multer';
import { resolve } from 'path';
import { generateIdWithChecksum } from '../utils/tokenizer.utils';
import { mkdirSync } from 'fs';
import User from '../users/user.interface';
import BadRequestException from '../exceptions/BadRequestException';

const privateStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const { _id: id } = req.user as User;
    const path = resolve(__dirname, `../../private/uploads/${id}/`);
    mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function(req, file, cb) {
    const { originalname } = file;
    const splitedOrignal = originalname.split('.');
    const name = `${Date.now()}-${generateIdWithChecksum(8)}.${splitedOrignal[splitedOrignal.length - 1]}`
    cb(null, name);
  }
});

const limits: Options['limits'] = {
  fileSize: 1024 * 1024 * 5 // 5 Mb
}

const fileFilter: Options['fileFilter'] = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
    ) {
      cb(null, true);
    }
  else {
    cb(new BadRequestException('invalid file type'));
  }
}

const privateUploadMiddleware = multer({
  storage: privateStorage,
  limits,
  fileFilter
});

export default privateUploadMiddleware;