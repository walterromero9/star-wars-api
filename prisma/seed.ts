import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { Role } from '@prisma/client'


const prisma = new PrismaClient()

async function main() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: Role.ADMIN },
  })

  if (!existingAdmin) {

    const hashedPassword = await bcrypt.hash('admin123', 10)

    await prisma.user.create({
      data: {
        email: 'admin@admin.com.ar',
        password: hashedPassword,
        role: 'ADMIN',
        name: 'Admin',
      },
    })
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  });
