import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { SkillService } from '../skill/skill.service';
import { CvService } from '../cv/cv.service';


async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const userService = app.get(UserService);
    const skillService = app.get(SkillService);
    const cvService = app.get(CvService);

    console.log('In seeder');

    // 1) Créer un utilisateur
    const user = await userService.create({
      username: 'Mohammed loay chatti',
      email: 'lou@gmail.com',
      password: '123456',
    });

    console.log('User created:', user);

    // 2) Créer un skill
    const skill = await skillService.create({
      designation: 'TensorFlow',
    });

    console.log('Skill created:', skill);

    // 3) Créer un CV lié au user et au skill
    const cv = await cvService.create({
      name: 'Chatti',
      firstname: 'Louay',
      age: 22,
      cin: 12345678,
      job: 'Backend Developer',
      path: '/files/cv-yassine.pdf',
      skillIds: [skill.id],
    }, user);

    console.log('Cv created:', cv);
    console.log('Seed terminé avec succès');
  } catch (error) {
    console.error('Erreur pendant le seed :', error);
  } finally {
    await app.close();
  }
}

bootstrap();