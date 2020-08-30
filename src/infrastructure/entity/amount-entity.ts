import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"; 
import { CustomerEntity } from "./customer-entity";


@Entity() 
export class Amount { 

   @PrimaryGeneratedColumn() 
   id!: number; 
   
   @Column() 
   amount!: number; 

   @OneToOne(type => CustomerEntity) 
   @JoinColumn({ name: "customer_id" }) 
   customer!: CustomerEntity;
   
}