import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { User, UserRole } from 'src/users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { IsEmail } from 'class-validator';



describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository ={
   findOne:jest.fn(),
   save:jest.fn(),
   create:jest.fn()
  }

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue("mockToken")
  }

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string)=>{
      if (key === 'JWT_SECRET') return 'secret';
      if (key === 'JWT_EXPIRES_IN') return '90d'
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
         {
          provide: getRepositoryToken(User),
          useValue:mockUserRepository
      },
      {
        provide: ConfigService,
        useValue: mockConfigService
      },
      {
        provide: JwtService,
        useValue:mockJwtService
      }
    ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it("signUp =>should sign up a user", async ()=>{
    const mockSignUpDto = {
      email:"jospeh@gmail.com",
      password:"joshua123",
      
    } as SignUpDto

   
    const mockUser={
      id:1,
      email:"joseph@gmail.com",
      password:"joshua123",
      role:"user",
      
    } as unknown as  User

    mockUserRepository.findOne.mockResolvedValue(null) //No user found
    mockUserRepository.create.mockReturnValue(mockUser),
    mockUserRepository.save.mockResolvedValue(mockUser)

    const result = await service.signUp(mockSignUpDto);
    expect(result).toEqual({
      status: "Successful",
      token:"mockToken",
      data:{
        user: {
      id: 1,
      email: "joseph@gmail.com",
      role:"user"
      // no password
    }
      }
    })

     expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: mockSignUpDto.email } });
    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    expect(mockJwtService.signAsync).toHaveBeenCalled();
  })
  it("login => should login a user", async ()=>{
    const mockSignInDto={
      email:"joseph@gmail.com",
      password:"joshua123"
    } as SignInDto

    const mockUser = {
      id: 1,
      email:"joseph@gmail.com",
      password:"joshua123",
      role: "user",
      comparePassword: jest.fn().mockResolvedValue(true)
    } as unknown as User

    mockUserRepository.findOne.mockResolvedValue(mockUser)
    mockUser.comparePassword = jest.fn().mockResolvedValue(true)
    mockJwtService.signAsync.mockResolvedValue("mockToken")
    const result = await service.signIn(mockSignInDto);
    expect(result).toMatchObject({
      status:"Successful",
      token:"mockToken",
      data:{
        user: {
      id: 1,
      email: "joseph@gmail.com",
      role:"user"
      // no password
    }
      }
    })
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({where:{email:mockSignInDto.email}})
    expect(mockUser.comparePassword).toHaveBeenCalledWith(mockSignInDto.password);
    expect(mockJwtService.signAsync).toHaveBeenCalledWith({id:mockUser.id, role:mockUser.role}, {
    secret: "secret",
    expiresIn: "90d"
  })
  })
});
