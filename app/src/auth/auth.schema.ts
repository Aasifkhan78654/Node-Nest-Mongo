
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Authentication extends Document {
    @Prop({ required: true, enum: ['email', 'google'] })
    strategy: string;

    @Prop({ required: function () { return this.strategy === 'email'; }, unique: true })
    email?: string;

    @Prop({ required: function () { return this.strategy === 'email'; } })
    password?: string;

    @Prop({ required: function () { return this.strategy === 'google'; } })
    googleProviderId?: string;

    @Prop({ required: false })
    firebasePushToken?: string;

    @Prop()
    whitelistedRefreshToken: string;
}

export const AuthenticationSchema = SchemaFactory.createForClass(Authentication);
