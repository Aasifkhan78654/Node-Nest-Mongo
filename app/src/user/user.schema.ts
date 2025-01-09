// src/user/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  phoneNumber?: string;

  @Prop({ required: true, unique: true })
  activationCode: string;

  @Prop({ required: false })
  subscribedPlan?: string;

  @Prop({ required: false })
  planDuration?: number;

  @Prop({ required: false })
  subscriptionStartDate?: Date;

  @Prop({ required: false })
  subscriptionEndDate?: Date;

  @Prop({ required: true, default: false })
  isSubscribed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
