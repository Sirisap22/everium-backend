import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import realEstateModel from '../real-estates/real-estate.model';

const raw = fs.readFileSync(path.resolve(__dirname, './Condo_Name.csv'), 'utf8');
const data  = raw.split(/\r?\n/);

const realEstates: { name: string, area: string }[] = []

for(const element of data) {
  if (element.split(',').length > 2) {
    console.log(element);
    continue
  }

  const [name, area] = element.split(',');

  if (!name || !area) {
    console.log(element)
    continue 
  }


  const realEstate = {
    name,
    area
  }
  realEstates.push(realEstate)
}

const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, DEV_MONGO_PATH } = process.env;

if (process.env.ENVIRONMENT === 'production') {
      mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`, async (error) => {
        if (error)
          console.log(error)
        else
          await onMongoDBConnected();
      });
    } else {
      mongoose.connect(`mongodb://${DEV_MONGO_PATH}`, async (error) => {
        if (error)
          console.log(error)
        else
          await onMongoDBConnected();
      });
    }

async function onMongoDBConnected() {
  console.log(`Connected to mongodb in ${process.env.ENVIRONMENT} mode`)
  
  await realEstateModel.create(realEstates)

  console.log(`inserted ${realEstates.length} documents`);

  mongoose.disconnect(async (error) => {
    if (error)
      console.log(error);
    else 
      console.log('Disconnected to mongodb');
  })
}



