import { Injectable } from '@nestjs/common';
import { IdGenerator } from '../../application/ports/id-generator.port';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UuidGenerator implements IdGenerator {
  generate(): string {
    return uuidv4();
  }
}
