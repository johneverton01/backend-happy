import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import Orphanage from './Orphanage';

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    createdAt: Date;

    @OneToMany(() => Orphanage, Orphanage => Orphanage.id, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({ name: 'user_id' })
    orphanage: Orphanage;

}