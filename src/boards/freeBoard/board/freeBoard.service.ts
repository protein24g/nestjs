import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserService } from "src/user/user.service";
import { FreeBoard } from "./entities/freeBoard.entity";
import { FreeBoardCreateDTO } from "./dto/freeBoard-create.dto";
import { PaginationDTO } from "src/boards/dto/pagination.dto";
import { FreeBoardUpdateDTO } from "./dto/freeBoard-update.dto";

@Injectable()
export class FreeBoardService {
  constructor(
    @InjectRepository(FreeBoard)
    private readonly freeBoardRepository: Repository<FreeBoard>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(userId: number, freeBoardCreateDTO: FreeBoardCreateDTO) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const post = this.freeBoardRepository.create({
      title: freeBoardCreateDTO.title,
      content: freeBoardCreateDTO.content,
      user: user,
    });
    
    await this.freeBoardRepository.save(post);
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { page, pageSize } = paginationDTO;
    const [posts, totalCount] = await this.freeBoardRepository.findAndCount({
      take: pageSize,
      skip: ( page - 1 ) * pageSize,
      relations: ['user'],
      select: {
        user: {
          nickname: true,
          profileImage: true,
        }
      }
    });

    return {
      result: posts,
      count: totalCount,
    };
  }

  async findOne(id: number) {
    const post = await this.freeBoardRepository.findOne({
      where: {
        id
      },
      relations: ['user', 'freeComments'],
      select: {
        user: {
          nickname: true,
          profileImage: true,
        }
      }
    });

    if (!post) {
      throw new NotFoundException('존재하지 않는 게시글');
    }

    post.viewCount += 1;
    return await this.freeBoardRepository.save(post);
  }

  async update(id: number, userId: number, freeBoardUpdateDTO: FreeBoardUpdateDTO) {
    const post = await this.freeBoardRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          id: true,
          profileImage: true,
        }
      }
    });

    if (!post) {
      throw new NotFoundException('존재하지 않는 게시글');
    }

    if (userId !== post.user.id) {
      throw new UnauthorizedException('게시글 작성자만 수정 가능합니다');
    }

    post.title = freeBoardUpdateDTO.title;
    post.content = freeBoardUpdateDTO.content;
    
    return await this.freeBoardRepository.save(post);
  }

  async delete(id: number, userId: number) {
    console.log('삭제 호출');
    const post = await this.freeBoardRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          id: true,
          profileImage: true,
        }
      }
    });

    if (!post) {
      throw new NotFoundException('존재하지 않는 게시글');
    }

    if (userId !== post.user.id) {
      throw new UnauthorizedException('게시글 작성자만 삭제 가능합니다');
    }

    return await this.freeBoardRepository.remove(post);
  }
}