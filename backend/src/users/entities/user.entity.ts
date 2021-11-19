import {
    Entity, Column, PrimaryGeneratedColumn,
    AfterInsert, BeforeRemove, AfterUpdate, 
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log('Inserted user with id', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated user with id', this.id);
    }

    @BeforeRemove()
    logRemove() {
        console.log('Removed user with id', this.id);
    }
}
