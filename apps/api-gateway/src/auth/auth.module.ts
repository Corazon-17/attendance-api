// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { JwtAuthGuard } from './jwt/jwt.guard';
// import { JwtStrategy } from './jwt/jwt.strategy';

// @Module({
//   imports: [
//     PassportModule,
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'supersecret',
//       signOptions: { expiresIn: '15m' },
//     }),
//   ],
//   providers: [JwtStrategy, JwtAuthGuard],
//   exports: [JwtStrategy, JwtAuthGuard],
// })
// export class AuthModule {}
