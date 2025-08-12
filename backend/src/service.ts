// import { Repository } from "typeorm";
// import type { FindManyOptions, FindOneOptions, ObjectLiteral } from "typeorm";

// export abstract class Service<T extends ObjectLiteral> {
//   private repository: Repository<T>;

//   constructor(repository: Repository<T>) {
//     this.repository = repository;
//   }

//   async create(entity: T): Promise<T> {
//     return this.repository.save(entity);
//   }

//   async findOne(opts: FindOneOptions<T>): Promise<T | null> {
//     return this.repository.findOne(opts);
//   }

//   async find(opts: FindManyOptions<T>): Promise<T[]> {
//     return this.repository.find(opts);
//   }

//   async update(id: string, entity: Partial<T>): Promise<T | null> {
//     await this.repository.update(id, entity);
//     return this.findOne({ where: { id } as any });
//   }

//   async delete(id: string): Promise<boolean> {
//     const result = await this.repository.delete(id);
//     return result.affected !== 0;
//   }

//   async findAll(): Promise<T[]> {
//     return this.repository.find();
//   }

//   //subscribe
// }
