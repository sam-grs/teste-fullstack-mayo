import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserService } from '../../services'
import { LoginUser } from '../entities/login-user.entity'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(user: any, passwordEntered: string): Promise<any> {
        const findUser = await this.userService.findByUser(user.email)

        if (!findUser) {
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND)
        }

        if (passwordEntered !== findUser.password) {
            throw new HttpException('Senha inválida!', HttpStatus.UNAUTHORIZED)
        }

        const { password, ...result } = findUser
        return result
    }

    async login(userLogin: LoginUser) {
        const payload = { sub: userLogin.email }
        const findUser = await this.userService.findByUser(userLogin.email)
        // await this.validateUser(findUser, userLogin.password)

        return {
            id: findUser.id,
            name: findUser.name,
            user: userLogin.email,
            password: '',
            token: `Bearer ${this.jwtService.sign(payload)}`,
        }
    }
}
