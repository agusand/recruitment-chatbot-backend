import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedExampleData1748449231965 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO hr_intelligent.profiles (email, first_name, last_name, is_external) VALUES
        ('agustin.andreacchi@email.com', 'Agustin', 'Andreacchi', 1),
        ('agustin.andreacchi@corporative.com', 'HR', 'Specialist', 0);
    `);
    await queryRunner.query(`
      INSERT INTO hr_intelligent.positions (name) VALUES
        ('Developer'), ('HR Specialist');
    `);
    await queryRunner.query(`
      INSERT INTO hr_intelligent.questions (question, cryteria, position) VALUES
        ('What is your experience with Node.js?', 'Technical experience', 1),
        ('Why do you want this position?', 'Motivation', 1),
        ('How do you handle working under pressure?', 'Soft skills', 1),
        ('Have you worked in agile teams?', 'Work methodologies', 1),
        ('What tools do you use for version control?', 'Technical tools', 1),
        ('How do you keep up to date with technology?', 'Professional growth', 1),
        ('Tell me about a technical challenge you have overcome.', 'Problem solving', 1),
        ('What do you value in a work environment?', 'Organizational culture', 1),
        ('Do you have experience leading teams?', 'Leadership', 1),
        ('How do you prioritize your daily tasks?', 'Time management', 1);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM hr_intelligent.questions`);
    await queryRunner.query(`DELETE FROM hr_intelligent.positions`);
    await queryRunner.query(`DELETE FROM hr_intelligent.profiles`);
  }
}
