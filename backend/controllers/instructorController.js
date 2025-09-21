import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 🔹 Get all instructors (with optional status filter)
export const getInstructors = async (req, res) => {
  try {
    const { status, search } = req.query;

    let where = { role: 'instructor' };
    if (status && status !== 'All') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const instructors = await prisma.user.findMany({
      where,
      include: {
        courses: true, // To get totalCourses
      },
      orderBy: { id: 'asc' },
    });

    const data = instructors.map((inst) => ({
      id: inst.id,
      name: inst.name,
      email: inst.email,
      totalCourses: inst.courses.length,
      rating: inst.rating || 0,
      status: inst.status,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch instructors' });
  }
};

// 🔹 Add a new instructor
export const addInstructor = async (req, res) => {
  try {
    const { name, email, totalCourses, rating, status, contact } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const instructor = await prisma.user.create({
      data: {
        name,
        email,
        role: 'instructor',
        status: status || 'Active',
        contact,
        rating: rating || 0,
      },
    });

    res.json(instructor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add instructor' });
  }
};

// 🔹 Update an instructor
export const updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, totalCourses, rating, status, contact } = req.body;

    const instructor = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        status,
        contact,
        rating: rating || 0,
      },
    });

    res.json(instructor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update instructor' });
  }
};

// 🔹 Delete an instructor
export const deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Instructor deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete instructor' });
  }
};

// 🔹 Get single instructor details
export const getInstructor = async (req, res) => {
  try {
    const { id } = req.params;

    const instructor = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { courses: true },
    });

    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });

    res.json({
      id: instructor.id,
      name: instructor.name,
      email: instructor.email,
      totalCourses: instructor.courses.length,
      rating: instructor.rating || 0,
      status: instructor.status,
      contact: instructor.contact,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch instructor' });
  }
};
