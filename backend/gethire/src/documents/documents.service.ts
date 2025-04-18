import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
  import toStream = require('buffer-to-stream');
  import { UserDocument } from './schemas/document.schema';
  import { CreateDocumentDto } from './dto/create-document.dto';
  import { UpdateDocumentDto } from './dto/update-document.dto';
  import { Role } from 'src/common/enums/role.enum';
  
  @Injectable()
  export class DocumentsService {
    constructor(
      @InjectModel(UserDocument.name)
      private readonly documentModel: Model<UserDocument>,
    ) {}
  
    async uploadImage(
      file: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
      return new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream((error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        toStream(file.buffer).pipe(upload);
      });
    }
  
    async uploadDocument(
      file: Express.Multer.File,
      userId: string,
      createDocumentDto: CreateDocumentDto,
      uploadedBy: Role,
    ) {
      const uploadResult = await this.uploadImage(file);
      
      const document = new this.documentModel({
        user: userId,
        title: createDocumentDto.title,
        description: createDocumentDto.description,
        profilePictureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        uploadedBy,
      });
  
      return document.save();
    }
  
    async getUserDocuments(userId: string) {
      return this.documentModel.find({ user: userId }).sort({ createdAt: -1 });
    }
  
    async getAllDocuments(query: any) {
      const { page = 1, limit = 10, isApproved } = query;
      const filter: any = {};
  
      if (isApproved !== undefined) {
        filter.isApproved = isApproved === 'true';
      }
  
      return this.documentModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user', 'name email role');
    }
  
    async getDocumentById(id: string, user: any) {
      const document = await this.documentModel.findById(id);
      if (!document) {
        throw new NotFoundException('Document not found');
      }
  
      // Only allow access if user is admin, or the document owner
      if (
        user.role !== Role.Admin &&
        document.user.toString() !== user.userId.toString()
      ) {
        throw new ForbiddenException(
          'You are not authorized to access this document',
        );
      }
  
      return document;
    }
  
  
async updateDocument(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
    user: any
) {
    const document = await this.documentModel.findById(id);
    if (!document) {
        throw new NotFoundException('Document not found');
    }

    // Check if the user is authorized to update this document
    if (
        user.role !== Role.Admin &&
        document.user.toString() !== user.userId.toString()
    ) {
        throw new ForbiddenException(
            'You are not authorized to update this document',
        );
    }

    // Update only the provided fields
    if (updateDocumentDto.title) {
        document.title = updateDocumentDto.title;
    }
    if (updateDocumentDto.description !== undefined) {
        document.description = updateDocumentDto.description;
    }
    if (updateDocumentDto.profilePictureUrl) {
        document.profilePictureUrl = updateDocumentDto.profilePictureUrl;
        // Note: If you're updating the image, you should also update publicId
        // and handle deleting the old image from Cloudinary
        // await v2.uploader.destroy(document.publicId); // Uncomment if you want to delete the old image
    }

    return document.save();
}
  
    async deleteDocument(id: string, user: any) {
      const document = await this.documentModel.findById(id);
      if (!document) {
        throw new NotFoundException('Document not found');
      }
  
      // Only allow delete if user is admin, or the document owner
      if (
        user.role !== Role.Admin &&
        document.user.toString() !== user.userId.toString()
      ) {
        throw new ForbiddenException(
          'You are not authorized to delete this document',
        );
      }
  
      // Delete from Cloudinary
      await v2.uploader.destroy(document.publicId);
  
      // Delete from database
      return this.documentModel.findByIdAndDelete(id);
    }



    
  }