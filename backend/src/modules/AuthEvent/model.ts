import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from '../User/model';

export enum AuthEventType {
  LOGIN_ATTEMPT = 'loginAttempt',
  PASSWORD_RESET = 'passwordReset',
  ACCOUNT_LOCKED = 'accountLocked',
  ACCOUNT_UNLOCKED = 'accountUnlocked',
  ACCOUNT_BANNED = 'accountBanned',
}

@Entity()
export default class AuthEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //   @ManyToOne(() => User, (user) => user.authEvents)
  //   user: User;

  @Column()
  action: string;

  @Column()
  timestamp: Date;

  @Column()
  ip: string;

  @Column({
    type: 'enum',
    enum: AuthEventType,
  })
  eventType: AuthEventType;

  // what is a clever way to encode the number of failed login attempts?
  // similar to using timestamps instead of bools
  // maybe lastIncorrectLoginAttemptTimestamp? + lastCorrectLoginAttemptTimestamp?
  @Column({ default: 0 })
  failedLoginAttempts: number;
}
