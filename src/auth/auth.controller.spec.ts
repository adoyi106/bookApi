import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UserRole } from 'src/users/user.entity';
import { SignInDto } from './dto/sign-in.dto';


describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService : Partial<AuthService>


  beforeEach(async () => {
    //Create the mock version of the AuthService
     mockAuthService = {
      signUp: jest.fn(),
      signIn: jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers:[{
        provide: AuthService,
        useValue: mockAuthService
      }]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("signUp",  ()=>{
    it("should call authService.signUp with dto and return a result", async ()=>{
        const dto: SignUpDto = {
          email:"adoyiowoicho@gmail.com",
          password:"adoyi123",
          role: UserRole.USER
        }

        const mockResponse = {
          status: "Successful",
          token:"mockToken",
          data: {
            user:{
              id:1,
              email: "adoyiowoicho@gmail.com",
              role:"user"

            }
          }
        };
        
        (mockAuthService.signUp as jest.Mock).mockResolvedValue(mockResponse);

        const result = await controller.signUp(dto);

        expect(mockAuthService.signUp).toHaveBeenCalledWith(dto);
        expect(result).toEqual(mockResponse)
      })
  })

  describe("login", ()=>{
    it("should call authservice.signIn with dto and return a result", async ()=>{
      const dto:SignInDto={
        email: "adoyiowoicho@gmail.com",
        password: "joshua123"
      }

      const mockResponse = {
        email: "adoyiowoicho@gmail.com",
        password: 'joshua123',
        role: UserRole.USER
      };
      (mockAuthService.signIn as jest.Mock).mockResolvedValue(mockResponse)

      const result = await controller.login(dto)

      expect(mockAuthService.signIn).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponse)
    });

  })
});
