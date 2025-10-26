// src/carriers/carriers.seed.ts
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, AnyBulkWriteOperation } from 'mongoose';
import { Carrier, CarrierDocument } from './schemas/carrier.schema';

type CarrierSeed = { code: string; name: string; active?: boolean };

@Injectable()
export class CarriersSeed implements OnApplicationBootstrap {
  private readonly logger = new Logger(CarriersSeed.name);

  constructor(
    @InjectModel(Carrier.name)
    private readonly carrierModel: Model<CarrierDocument>,
  ) {}

  async onApplicationBootstrap() {
    // Read from ENV; keep it optional & idempotent
    const raw = process.env.CARRIERS_JSON ?? '[]';

    let carriers: CarrierSeed[] = [];
    try {
      carriers = JSON.parse(raw);
    } catch {
      this.logger.error('CARRIERS_JSON is not valid JSON');
      return;
    }

    if (!Array.isArray(carriers) || carriers.length === 0) {
      this.logger.log('No carriers to seed.');
      return;
    }

    // Ensure indexes exist (prevents dupes on races)
    await this.carrierModel.createIndexes();

    const ops: AnyBulkWriteOperation<CarrierDocument>[] = carriers.map((c) => ({
      updateOne: {
        filter: { code: c.code },
        update: {
          $setOnInsert: {
            code: c.code,
            name: c.name,
            active: c.active ?? true,
          },
        },
        upsert: true,
      },
    }));

    await this.carrierModel.bulkWrite(ops, { ordered: false });
    this.logger.log(`Seeded carriers (upsert): ${carriers.map(c => c.code).join(', ')}`);
  }
}
