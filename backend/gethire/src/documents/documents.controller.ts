import {
    Controller,
    Post,
    UseGuards,
    Request,
    UploadedFile,
    UseInterceptors,
    Body,
    Get,
    Param,
    Delete,
    Patch,
    Query,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { v2 } from 'cloudinary';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }


    @Post('upload')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Student, Role.Teacher)
    @UseInterceptors(FileInterceptor('file'))
    async uploadDocument(
        @Request() req,
        @UploadedFile() file: Express.Multer.File,
        @Body() createDocumentDto: CreateDocumentDto,
    ) {
        if (!file) {
            throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }

        const uploadedBy = req.user.roles?.[0]; 

        return this.documentsService.uploadDocument(
            file,
            req.user.userId,
            createDocumentDto,
            uploadedBy,
        );
    }



    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Student, Role.Teacher, Role.Admin)
    async getUserDocuments(@Request() req) {
        return this.documentsService.getUserDocuments(req.user.userId);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async getAllDocuments(@Query() query: any) {
        return this.documentsService.getAllDocuments(query);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Student, Role.Teacher, Role.Admin)
    async getDocumentById(@Param('id') id: string, @Request() req) {
        return this.documentsService.getDocumentById(id, req.user);
    }



    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Student, Role.Teacher, Role.Admin)
    async deleteDocument(@Param('id') id: string, @Request() req) {
        return this.documentsService.deleteDocument(id, req.user);
    }



    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Student, Role.Teacher)
    @UseInterceptors(FileInterceptor('file'))
    async updateDocument(
        @Param('id') id: string,
        @Body() updateDocumentDto: UpdateDocumentDto,
        @Request() req,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        if (file) {
            // If a new file is uploaded, process it and update the URL
            const uploadResult = await this.documentsService.uploadImage(file);
            updateDocumentDto.profilePictureUrl = uploadResult.secure_url;
            
            // You might want to delete the old image from Cloudinary here
            const document = await this.documentsService.getDocumentById(id, req.user);
            await v2.uploader.destroy(document.publicId);
        }
        
        return this.documentsService.updateDocument(id, updateDocumentDto, req.user);
    }



}