"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Programs_1 = require("../models/Programs");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const programs = await Programs_1.ProgramsModel.findAll();
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
    }
    catch (error) {
        console.error('Error fetching programs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch programs',
            error: error.message
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const program = await Programs_1.ProgramsModel.findById(parseInt(id));
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
    }
    catch (error) {
        console.error('Error fetching program:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch program',
            error: error.message
        });
    }
});
router.get('/member/:memberName', async (req, res) => {
    try {
        const { memberName } = req.params;
        const programs = await Programs_1.ProgramsModel.findByMember(memberName);
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
    }
    catch (error) {
        console.error('Error fetching programs by member:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch programs by member',
            error: error.message
        });
    }
});
router.get('/search/:searchTerm', async (req, res) => {
    try {
        const { searchTerm } = req.params;
        const programs = await Programs_1.ProgramsModel.search(searchTerm);
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
    }
    catch (error) {
        console.error('Error searching programs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search programs',
            error: error.message
        });
    }
});
router.post('/', async (req, res) => {
    try {
        const programData = req.body;
        if (!programData.member_name) {
            return res.status(400).json({
                success: false,
                message: 'Member name is required'
            });
        }
        const newProgram = await Programs_1.ProgramsModel.create(programData);
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
    }
    catch (error) {
        console.error('Error creating program:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create program',
            error: error.message
        });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body, id: parseInt(id) };
        const updatedProgram = await Programs_1.ProgramsModel.update(parseInt(id), updateData);
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
    }
    catch (error) {
        console.error('Error updating program:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update program',
            error: error.message
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Programs_1.ProgramsModel.softDelete(parseInt(id));
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
    }
    catch (error) {
        console.error('Error deleting program:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete program',
            error: error.message
        });
    }
});
router.get('/stats/count', async (req, res) => {
    try {
        const totalPrograms = await Programs_1.ProgramsModel.count();
        const activePrograms = await Programs_1.ProgramsModel.countActive();
        res.json({
            success: true,
            data: {
                totalPrograms,
                activePrograms,
                inactivePrograms: totalPrograms - activePrograms
            }
        });
    }
    catch (error) {
        console.error('Error fetching programs stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch programs statistics',
            error: error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=programs.js.map