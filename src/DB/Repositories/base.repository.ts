import mongoose, {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

export abstract class BaseRepository<T> {
  constructor(private model: Model<T>) {}

  async createNewDocument(document: Partial<T>): Promise<T> {
    return await this.model.create(document);
  }

  async findOneDocument(
    filters: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>
  ): Promise<T | null> {
    return await this.model.findOne(filters, projection, options);
  }

  async findDocumentById(
    id: mongoose.Types.ObjectId | string,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>
  ): Promise<T | null> {
    return await this.model.findById(id, projection, options);
  }

  async deleteByIdDocument(id: mongoose.Types.ObjectId) {
    return await this.model.findByIdAndDelete(id);
  }

  async updateOneDocument(filters: FilterQuery<T>, document: Partial<T>) {
    return await this.model.updateOne(filters, document);
  }

  async deleteOneDocument(filters: FilterQuery<T>) {
    return await this.model.deleteOne(filters);
  }

  async deleteMultipleDocuments(filters: FilterQuery<T>) {
    return await this.model.deleteMany(filters);
  }

  async findAndUpdateDocument(filters: FilterQuery<T>, document: UpdateQuery<T>, options?: QueryOptions<T>) {
    return await this.model.findOneAndUpdate(filters, document, options);
  }

  async findAndDeleteDocument(filters: FilterQuery<T>) {
    return await this.model.findOneAndDelete(filters);
  }

  async findDocuments(filters: FilterQuery<T>) {
    return await this.model.find(filters);
  }

  async findByIdAndUpdateDocument(
    id: mongoose.Types.ObjectId,
    document: Partial<T>,
    options?: QueryOptions<T>
  ) {
    return await this.model.findByIdAndUpdate(id, document, options);
  }

  async findByIdAndDeleteDocument(id: mongoose.Types.ObjectId) {
    return await this.model.findByIdAndDelete(id);
  }
}
