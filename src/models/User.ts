import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';


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

    /*  @OneToMany(() => Image, image => image.orphanage, {
         cascade: ['insert', 'update']
     })
     @JoinColumn({ name: 'orphanage_id' })
     images: Image[]; */

}