import express from 'express';
import { ProgramsModel } from '../models/Programs';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Get all programs
router.get('/', async (req, res) => {
  try {
    const programs = await ProgramsModel.findAll();
    res.json({
      success: true,
      data: programs.map(program => ({
        ...program,
        general_info: typeof program.general_info === 'string' 
          ? JSON.parse(program.general_info) 
          : program.general_info,
        education_materials: typeof program.education_materials === 'string' 
          ? JSON.parse(program.education_materials) 
          : program.education_materials,
        specific_materials: typeof program.specific_materials === 'string' 
          ? JSON.parse(program.specific_materials) 
          : program.specific_materials,
        assisting_groups: typeof program.assisting_groups === 'string' 
          ? JSON.parse(program.assisting_groups) 
          : program.assisting_groups,
        evaluation: typeof program.evaluation === 'string' 
          ? JSON.parse(program.evaluation) 
          : program.evaluation,
        successful_programs: typeof program.successful_programs === 'string' 
          ? JSON.parse(program.successful_programs) 
          : program.successful_programs
      }))
    });
  } catch (error: any) {
    console.error('Error fetching programs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programs',
      error: error.message
    });
  }
});

// Get program by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const program = await ProgramsModel.findById(parseInt(id));
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...program,
        general_info: typeof program.general_info === 'string' 
          ? JSON.parse(program.general_info) 
          : program.general_info,
        education_materials: typeof program.education_materials === 'string' 
          ? JSON.parse(program.education_materials) 
          : program.education_materials,
        specific_materials: typeof program.specific_materials === 'string' 
          ? JSON.parse(program.specific_materials) 
          : program.specific_materials,
        assisting_groups: typeof program.assisting_groups === 'string' 
          ? JSON.parse(program.assisting_groups) 
          : program.assisting_groups,
        evaluation: typeof program.evaluation === 'string' 
          ? JSON.parse(program.evaluation) 
          : program.evaluation,
        successful_programs: typeof program.successful_programs === 'string' 
          ? JSON.parse(program.successful_programs) 
          : program.successful_programs
      }
    });
  } catch (error: any) {
    console.error('Error fetching program:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch program',
      error: error.message
    });
  }
});

// Get programs by member name
router.get('/member/:memberName', async (req, res) => {
  try {
    const { memberName } = req.params;
    const programs = await ProgramsModel.findByMember(memberName);
    
    res.json({
      success: true,
      data: programs.map(program => ({
        ...program,
        general_info: typeof program.general_info === 'string' 
          ? JSON.parse(program.general_info) 
          : program.general_info,
        education_materials: typeof program.education_materials === 'string' 
          ? JSON.parse(program.education_materials) 
          : program.education_materials,
        specific_materials: typeof program.specific_materials === 'string' 
          ? JSON.parse(program.specific_materials) 
          : program.specific_materials,
        assisting_groups: typeof program.assisting_groups === 'string' 
          ? JSON.parse(program.assisting_groups) 
          : program.assisting_groups,
        evaluation: typeof program.evaluation === 'string' 
          ? JSON.parse(program.evaluation) 
          : program.evaluation,
        successful_programs: typeof program.successful_programs === 'string' 
          ? JSON.parse(program.successful_programs) 
          : program.successful_programs
      }))
    });
  } catch (error: any) {
    console.error('Error fetching programs by member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programs by member',
      error: error.message
    });
  }
});

// Search programs
router.get('/search/:searchTerm', async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const programs = await ProgramsModel.search(searchTerm);
    
    res.json({
      success: true,
      data: programs.map(program => ({
        ...program,
        general_info: typeof program.general_info === 'string' 
          ? JSON.parse(program.general_info) 
          : program.general_info,
        education_materials: typeof program.education_materials === 'string' 
          ? JSON.parse(program.education_materials) 
          : program.education_materials,
        specific_materials: typeof program.specific_materials === 'string' 
          ? JSON.parse(program.specific_materials) 
          : program.specific_materials,
        assisting_groups: typeof program.assisting_groups === 'string' 
          ? JSON.parse(program.assisting_groups) 
          : program.assisting_groups,
        evaluation: typeof program.evaluation === 'string' 
          ? JSON.parse(program.evaluation) 
          : program.evaluation,
        successful_programs: typeof program.successful_programs === 'string' 
          ? JSON.parse(program.successful_programs) 
          : program.successful_programs
      }))
    });
  } catch (error: any) {
    console.error('Error searching programs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search programs',
      error: error.message
    });
  }
});

// Create new program
router.post('/', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req, res) => {
  try {
    const programData = req.body;
    
    const newProgram = await ProgramsModel.create(programData);
    
    res.status(201).json({
      success: true,
      message: 'Program created successfully',
      data: {
        ...newProgram,
        general_info: typeof newProgram.general_info === 'string' 
          ? JSON.parse(newProgram.general_info) 
          : newProgram.general_info,
        education_materials: typeof newProgram.education_materials === 'string' 
          ? JSON.parse(newProgram.education_materials) 
          : newProgram.education_materials,
        specific_materials: typeof newProgram.specific_materials === 'string' 
          ? JSON.parse(newProgram.specific_materials) 
          : newProgram.specific_materials,
        assisting_groups: typeof newProgram.assisting_groups === 'string' 
          ? JSON.parse(newProgram.assisting_groups) 
          : newProgram.assisting_groups,
        evaluation: typeof newProgram.evaluation === 'string' 
          ? JSON.parse(newProgram.evaluation) 
          : newProgram.evaluation,
        successful_programs: typeof newProgram.successful_programs === 'string' 
          ? JSON.parse(newProgram.successful_programs) 
          : newProgram.successful_programs
      }
    });
  } catch (error: any) {
    console.error('Error creating program:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create program',
      error: error.message
    });
  }
});

// Update program
router.put('/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, id: parseInt(id) };
    
    const updatedProgram = await ProgramsModel.update(parseInt(id), updateData);
    
    if (!updatedProgram) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    res.json({
      success: true,
      message: 'Program updated successfully',
      data: {
        ...updatedProgram,
        general_info: typeof updatedProgram.general_info === 'string' 
          ? JSON.parse(updatedProgram.general_info) 
          : updatedProgram.general_info,
        education_materials: typeof updatedProgram.education_materials === 'string' 
          ? JSON.parse(updatedProgram.education_materials) 
          : updatedProgram.education_materials,
        specific_materials: typeof updatedProgram.specific_materials === 'string' 
          ? JSON.parse(updatedProgram.specific_materials) 
          : updatedProgram.specific_materials,
        assisting_groups: typeof updatedProgram.assisting_groups === 'string' 
          ? JSON.parse(updatedProgram.assisting_groups) 
          : updatedProgram.assisting_groups,
        evaluation: typeof updatedProgram.evaluation === 'string' 
          ? JSON.parse(updatedProgram.evaluation) 
          : updatedProgram.evaluation,
        successful_programs: typeof updatedProgram.successful_programs === 'string' 
          ? JSON.parse(updatedProgram.successful_programs) 
          : updatedProgram.successful_programs
      }
    });
  } catch (error: any) {
    console.error('Error updating program:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update program',
      error: error.message
    });
  }
});

// Delete program (soft delete)
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const success = await ProgramsModel.softDelete(parseInt(id));
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }

    res.json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting program:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete program',
      error: error.message
    });
  }
});

// Get programs statistics
router.get('/stats/count', async (req, res) => {
  try {
    const totalPrograms = await ProgramsModel.count();
    const activePrograms = await ProgramsModel.countActive();
    
    res.json({
      success: true,
      data: {
        totalPrograms,
        activePrograms,
        inactivePrograms: totalPrograms - activePrograms
      }
    });
  } catch (error: any) {
    console.error('Error fetching programs stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programs statistics',
      error: error.message
    });
  }
});

export default router;
