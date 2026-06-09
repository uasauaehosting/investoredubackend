import express from 'express';
import { body, validationResult } from 'express-validator';
import { Authority, Category, ReadingMaterial, FrameworkModel, MemberActivity, MemberStrategyProject, AlertsBulletinsModel, PrincipleModel, InvestmentProductModel, EducationContent } from '../models';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

const optionalUrl = (
  field: string,
  message: string,
  options: { require_tld?: boolean } = {},
) =>
  body(field)
    .optional({ nullable: true, checkFalsy: true })
    .isURL({ require_tld: options.require_tld ?? false })
    .withMessage(message);

// =============================================
// AUTHORITIES ROUTES
// =============================================

router.get('/authorities', async (req: any, res: any) => {
  try {
    const authorities = await Authority.findAll();
    res.json(authorities);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/authorities', authenticate, authorize('Super Admin', 'Admin'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('type').optional().isIn(['University', 'Hospital', 'Government Body', 'Research Institute', 'Other']).withMessage('Invalid type'),
  body('description').optional().isString(),
  body('website').optional().isURL().withMessage('Website must be a valid URL'),
  body('logo').optional().isString(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const authorityData = {
      name: req.body.name,
      type: req.body.type || 'Other',
      description: req.body.description || '',
      website: req.body.website || '',
      logo: req.body.logo || '',
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const authorityId = await Authority.create(authorityData);
    const authority = await Authority.findById(authorityId);
    res.status(201).json(authority);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/authorities/:id', authenticate, authorize('Super Admin', 'Admin'), [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('type').optional().isIn(['University', 'Hospital', 'Government Body', 'Research Institute', 'Other']).withMessage('Invalid type'),
  body('description').optional().isString(),
  body('website').optional().isURL().withMessage('Website must be a valid URL'),
  body('logo').optional().isString(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const authorityId = parseInt(req.params.id);
    const success = await Authority.update(authorityId, req.body);
    
    if (!success) {
      return res.status(404).json({ message: 'Authority not found' });
    }

    const authority = await Authority.findById(authorityId);
    res.json(authority);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/authorities/:id', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
  try {
    const authorityId = parseInt(req.params.id);
    const success = await Authority.delete(authorityId);
    
    if (!success) {
      return res.status(404).json({ message: 'Authority not found' });
    }

    res.json({ message: 'Authority deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// =============================================
// CATEGORIES ROUTES
// =============================================

router.get('/categories', async (req: any, res: any) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/categories/authority/:authorityId', async (req: any, res: any) => {
  try {
    const authorityId = parseInt(req.params.authorityId);
    const categories = await Category.findByAuthority(authorityId);
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/categories', authenticate, authorize('Super Admin', 'Admin'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('authorityId').isInt({ min: 1 }).withMessage('Authority ID must be a positive integer'),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const categoryData = {
      name: req.body.name,
      authorityId: req.body.authorityId,
      description: req.body.description || '',
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const categoryId = await Category.create(categoryData);
    const category = await Category.findById(categoryId);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/categories/:id', authenticate, authorize('Super Admin', 'Admin'), [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('authorityId').optional().isInt({ min: 1 }).withMessage('Authority ID must be a positive integer'),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const categoryId = parseInt(req.params.id);
    const success = await Category.update(categoryId, req.body);
    
    if (!success) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const category = await Category.findById(categoryId);
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/categories/:id', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
  try {
    const categoryId = parseInt(req.params.id);
    const success = await Category.delete(categoryId);
    
    if (!success) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Simplified routes for now
router.get('/reading-materials', async (req: any, res: any) => {
  try {
    const materials = await ReadingMaterial.findAll();
    res.json(materials);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/reading-materials', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('author').optional().isString(),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid date'),
  body('pdfUrl').optional().isURL().withMessage('PDF URL must be a valid URL'),
  body('authorityId').optional().isInt({ min: 1 }).withMessage('Authority ID must be a positive integer'),
  body('categoryId').optional().isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),
  body('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
  body('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Set default values for optional fields
    const materialData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      author: req.body.author || '',
      date: new Date(req.body.date),
      pdfUrl: req.body.pdfUrl || '',
      authorityId: req.body.authorityId || null,
      categoryId: req.body.categoryId || null,
      views: req.body.views || 0,
      downloads: req.body.downloads || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const materialId = await ReadingMaterial.create(materialData);
    const material = await ReadingMaterial.findById(materialId);
    res.status(201).json(material);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET route for individual reading material
router.get('/reading-materials/:id', async (req: any, res: any) => {
  try {
    const materialId = parseInt(req.params.id);
    const material = await ReadingMaterial.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: 'Reading material not found' });
    }
    res.json(material);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT route for updating reading materials
router.put('/reading-materials/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('author').optional().isString(),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  body('pdfUrl').optional().isURL().withMessage('PDF URL must be a valid URL'),
  body('authorityId').optional().isInt({ min: 1 }).withMessage('Authority ID must be a positive integer'),
  body('categoryId').optional().isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),
  body('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
  body('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const materialId = parseInt(req.params.id);
    const updateData = req.body;

    // Convert date string to Date object if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const updated = await ReadingMaterial.update(materialId, updateData);
    if (!updated) {
      return res.status(404).json({ message: 'Reading material not found' });
    }

    const material = await ReadingMaterial.findById(materialId);
    res.json(material);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE route for reading materials
router.delete('/reading-materials/:id', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
  try {
    const materialId = parseInt(req.params.id);
    const deleted = await ReadingMaterial.delete(materialId);
    if (!deleted) {
      return res.status(404).json({ message: 'Reading material not found' });
    }
    res.json({ message: 'Reading material deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// =============================================
// FRAMEWORKS ROUTES
// =============================================

router.get('/frameworks', async (req: any, res: any) => {
  try {
    const frameworks = await FrameworkModel.findAll();
    res.json(frameworks);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/frameworks/:id', async (req: any, res: any) => {
  try {
    const frameworkId = parseInt(req.params.id);
    const framework = await FrameworkModel.findById(frameworkId);
    if (!framework) {
      return res.status(404).json({ message: 'Framework not found' });
    }
    res.json(framework);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/frameworks', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('author').optional().isString(),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid date'),
  optionalUrl('fileUrl', 'File URL must be a valid URL'),
  optionalUrl('imageUrl', 'Image URL must be a valid URL'),
  body('content').optional().isString(),
  body('authorityId').optional().custom((value) => {
    if (value === null || value === undefined) return true;
    return Number.isInteger(value) && value > 0;
  }).withMessage('Authority ID must be a positive integer or null'),
  body('categoryId').optional().custom((value) => {
    if (value === null || value === undefined) return true;
    return Number.isInteger(value) && value > 0;
  }).withMessage('Category ID must be a positive integer or null'),
  body('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
  body('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Set default values for optional fields
    const frameworkData = {
      title: req.body.title,
      description: req.body.description,
      author: req.body.author || '',
      date: new Date(req.body.date),
      fileUrl: req.body.fileUrl || '',
      imageUrl: req.body.imageUrl || '',
      content: req.body.content || '',
      authorityId: req.body.authorityId || null,
      categoryId: req.body.categoryId || null,
      views: req.body.views || 0,
      downloads: req.body.downloads || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const frameworkId = await FrameworkModel.create(frameworkData);
    const framework = await FrameworkModel.findById(frameworkId);
    res.status(201).json(framework);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/frameworks/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('author').optional().isString(),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  optionalUrl('fileUrl', 'File URL must be a valid URL'),
  optionalUrl('imageUrl', 'Image URL must be a valid URL'),
  body('content').optional().isString(),
  body('authorityId').optional().custom((value) => {
    if (value === null || value === undefined) return true;
    return Number.isInteger(value) && value > 0;
  }).withMessage('Authority ID must be a positive integer or null'),
  body('categoryId').optional().custom((value) => {
    if (value === null || value === undefined) return true;
    return Number.isInteger(value) && value > 0;
  }).withMessage('Category ID must be a positive integer or null'),
  body('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
  body('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const frameworkId = parseInt(req.params.id);
    const updateData = req.body;

    // Convert date string to Date object if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const updated = await FrameworkModel.update(frameworkId, updateData);
    if (!updated) {
      return res.status(404).json({ message: 'Framework not found' });
    }

    const framework = await FrameworkModel.findById(frameworkId);
    res.json(framework);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/frameworks/:id', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
  try {
    const frameworkId = parseInt(req.params.id);
    const deleted = await FrameworkModel.delete(frameworkId);
    if (!deleted) {
      return res.status(404).json({ message: 'Framework not found' });
    }
    res.json({ message: 'Framework deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// =============================================
// PRINCIPLES ROUTES
// =============================================

router.get('/principles', async (req: any, res: any) => {
  try {
    const principles = await PrincipleModel.findAll();
    res.json(principles);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/principles/admin', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req: any, res: any) => {
  try {
    const principles = await PrincipleModel.findAllAdmin();
    res.json(principles);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/principles/:id', async (req: any, res: any) => {
  try {
    const principleId = parseInt(req.params.id);
    const principle = await PrincipleModel.findById(principleId);
    
    if (!principle) {
      return res.status(404).json({ message: 'Principle not found' });
    }
    
    res.json(principle);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/principles', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('author').optional().isString(),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid date'),
  optionalUrl('fileUrl', 'File URL must be a valid URL'),
  optionalUrl('imageUrl', 'Image URL must be a valid URL'),
  body('content').optional().isString(),
  body('authorityId').optional().custom((value) => {
    if (value === null || value === undefined) return true;
    return Number.isInteger(value) && value > 0;
  }).withMessage('Authority ID must be a positive integer or null'),
  body('categoryId').optional().custom((value) => {
    if (value === null || value === undefined) return true;
    return Number.isInteger(value) && value > 0;
  }).withMessage('Category ID must be a positive integer or null'),
  body('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
  body('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const principleData = {
      title: req.body.title,
      description: req.body.description,
      author: req.body.author || '',
      date: new Date(req.body.date),
      fileUrl: req.body.fileUrl || '',
      imageUrl: req.body.imageUrl || '',
      content: req.body.content || '',
      authorityId: req.body.authorityId || null,
      categoryId: req.body.categoryId || null,
      views: req.body.views || 0,
      downloads: req.body.downloads || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const principleId = await PrincipleModel.create(principleData);
    const principle = await PrincipleModel.findById(principleId);
    res.status(201).json(principle);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/principles/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('author').optional().isString(),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  optionalUrl('fileUrl', 'File URL must be a valid URL'),
  optionalUrl('imageUrl', 'Image URL must be a valid URL'),
  body('content').optional().isString(),
  body('authorityId').optional().custom((value) => {
    if (value === null || value === undefined) return true;
    return Number.isInteger(value) && value > 0;
  }).withMessage('Authority ID must be a positive integer or null'),
  body('categoryId').optional().custom((value) => {
    if (value === null || value === undefined) return true;
    return Number.isInteger(value) && value > 0;
  }).withMessage('Category ID must be a positive integer or null'),
  body('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
  body('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const principleId = parseInt(req.params.id);
    const success = await PrincipleModel.update(principleId, req.body);
    
    if (!success) {
      return res.status(404).json({ message: 'Principle not found' });
    }

    const principle = await PrincipleModel.findById(principleId);
    res.json(principle);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/principles/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req: any, res: any) => {
  try {
    const principleId = parseInt(req.params.id);
    const success = await PrincipleModel.delete(principleId);
    
    if (!success) {
      return res.status(404).json({ message: 'Principle not found' });
    }

    res.json({ message: 'Principle deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// =============================================
// INVESTMENT PRODUCTS ROUTES
// =============================================

router.get('/investment-products', async (req: any, res: any) => {
  try {
    const products = await InvestmentProductModel.findAll();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/investment-products/slug/:slug', async (req: any, res: any) => {
  try {
    const product = await InvestmentProductModel.findBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ message: 'Investment product not found' });
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/investment-products/admin', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req: any, res: any) => {
  try {
    const products = await InvestmentProductModel.findAllAdmin();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/investment-products/:id', async (req: any, res: any) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await InvestmentProductModel.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Investment product not found' });
    }
    
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/investment-products', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('author').optional().isString(),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid date'),
  optionalUrl('fileUrl', 'File URL must be a valid URL'),
  optionalUrl('imageUrl', 'Image URL must be a valid URL'),
  body('content').optional().isString(),
  body('slug').optional().isString(),
  body('authorityId').optional().custom((value) => {
    if (value === null || value === undefined) return true;
    return Number.isInteger(value) && value > 0;
  }).withMessage('Authority ID must be a positive integer or null'),
  body('categoryId').optional().custom((value) => {
    if (value === null || value === undefined) return true;
    return Number.isInteger(value) && value > 0;
  }).withMessage('Category ID must be a positive integer or null'),
  body('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
  body('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productData = {
      title: req.body.title,
      description: req.body.description,
      author: req.body.author || '',
      date: new Date(req.body.date),
      fileUrl: req.body.fileUrl || '',
      imageUrl: req.body.imageUrl || '',
      content: req.body.content || '',
      slug: req.body.slug || null,
      authorityId: req.body.authorityId || null,
      categoryId: req.body.categoryId || null,
      views: req.body.views || 0,
      downloads: req.body.downloads || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const productId = await InvestmentProductModel.create(productData);
    const product = await InvestmentProductModel.findById(productId);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/investment-products/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('author').optional().isString(),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  optionalUrl('fileUrl', 'File URL must be a valid URL'),
  optionalUrl('imageUrl', 'Image URL must be a valid URL'),
  body('content').optional().isString(),
  body('slug').optional().isString(),
  body('authorityId').optional().custom((value) => {
    if (value === null || value === undefined) return true;
    return Number.isInteger(value) && value > 0;
  }).withMessage('Authority ID must be a positive integer or null'),
  body('categoryId').optional().custom((value) => {
    if (value === null || value === undefined) return true;
    return Number.isInteger(value) && value > 0;
  }).withMessage('Category ID must be a positive integer or null'),
  body('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
  body('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productId = parseInt(req.params.id);
    const success = await InvestmentProductModel.update(productId, req.body);
    
    if (!success) {
      return res.status(404).json({ message: 'Investment product not found' });
    }

    const product = await InvestmentProductModel.findById(productId);
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/investment-products/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req: any, res: any) => {
  try {
    const productId = parseInt(req.params.id);
    const success = await InvestmentProductModel.delete(productId);
    
    if (!success) {
      return res.status(404).json({ message: 'Investment product not found' });
    }

    res.json({ message: 'Investment product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// =============================================
// MEMBER ACTIVITIES ROUTES
// =============================================

router.get('/member-activities', async (req: any, res: any) => {
  try {
    const activities = await MemberActivity.findAll();
    res.json(activities);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/member-activities', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').notEmpty().withMessage('Type is required'),
  body('organization').notEmpty().withMessage('Organization is required'),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  body('status').optional().isString(),
  body('participants').optional().isInt({ min: 0 }).withMessage('Participants must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Set default values for optional fields
    const activityData = {
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      organization: req.body.organization,
      date: req.body.date ? new Date(req.body.date) : new Date(),
      status: req.body.status || 'Active',
      participants: req.body.participants || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const activityId = await MemberActivity.create(activityData);
    const activity = await MemberActivity.findById(activityId);
    res.status(201).json(activity);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// =============================================
// MEMBER STRATEGIES & PROJECTS ROUTES
// =============================================

router.get('/member-strategies-projects', async (req: any, res: any) => {
  try {
    const projects = await MemberStrategyProject.findAll();
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/member-strategies-projects', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('memberId').notEmpty().withMessage('Member ID is required').isInt(),
  body('categoryId').notEmpty().withMessage('Category ID is required').isInt(),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid date'),
  optionalUrl('fileUrl', 'File URL must be a valid URL', { require_tld: true }),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const projectData = {
      title: req.body.title,
      description: req.body.description,
      memberId: req.body.memberId,
      type: req.body.type || 'Project',
      status: req.body.status || 'Active',
      start_date: new Date(req.body.date || Date.now()),
      end_date: req.body.endDate ? new Date(req.body.endDate) : undefined,
      budget: req.body.budget || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const projectId = await MemberStrategyProject.create(projectData);
    const project = await MemberStrategyProject.findById(projectId);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/member-strategies-projects/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('memberId').optional().isInt(),
  body('categoryId').optional().isInt(),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  optionalUrl('fileUrl', 'File URL must be a valid URL', { require_tld: true }),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updated = await MemberStrategyProject.update(parseInt(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const project = await MemberStrategyProject.findById(parseInt(req.params.id));
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/member-strategies-projects/:id', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
  try {
    const deleted = await MemberStrategyProject.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// =============================================
// EDUCATION CONTENT ROUTES (section list/detail pages)
// =============================================

router.get('/content', async (req: any, res: any) => {
  try {
    const section = req.query.section as string;
    if (!section) {
      return res.status(400).json({ message: 'section query parameter is required' });
    }
    const items = await EducationContent.findBySection(section);
    res.json(items.map((item) => ({
      id: item.id,
      section: item.section,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      content: item.content,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    })));
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/content/admin', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req: any, res: any) => {
  try {
    const section = req.query.section as string | undefined;
    const items = await EducationContent.findAllAdmin(section);
    res.json(items.map((item) => ({
      id: item.id,
      section: item.section,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      content: item.content,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    })));
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/content/:id', async (req: any, res: any) => {
  try {
    const item = await EducationContent.findById(parseInt(req.params.id));
    if (!item) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json({
      id: item.id,
      section: item.section,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      content: item.content,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/content', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req: any, res: any) => {
  try {
    const id = await EducationContent.create({
      section: req.body.section,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl ?? null,
      content: req.body.content ?? null,
      displayOrder: req.body.displayOrder ?? 0,
      isActive: req.body.isActive !== false,
    });
    const item = await EducationContent.findById(id, false);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/content/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req: any, res: any) => {
  try {
    const updated = await EducationContent.update(parseInt(req.params.id), {
      section: req.body.section,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      content: req.body.content,
      displayOrder: req.body.displayOrder,
      isActive: req.body.isActive,
    });
    if (!updated) return res.status(404).json({ message: 'Content not found' });
    const item = await EducationContent.findById(parseInt(req.params.id), false);
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/content/:id', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
  try {
    const deleted = await EducationContent.delete(parseInt(req.params.id));
    if (!deleted) return res.status(404).json({ message: 'Content not found' });
    res.json({ message: 'Content deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/alerts-bulletins', async (req: any, res: any) => {
  try {
    const alerts = await AlertsBulletinsModel.getAll();
    res.json(alerts);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/alerts-bulletins', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').notEmpty().withMessage('Type is required'),
  body('priority').optional().isString(),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid date'),
  body('author').optional().isString(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Set default values for optional fields
    const bulletinData = {
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      content: req.body.content || '',
      authority_name: req.body.authority_name || 'System Admin',
      year: req.body.year || new Date().getFullYear().toString(),
      date_published: new Date(req.body.date_published || Date.now()),
      link: req.body.link || '',
      display_order: req.body.display_order || 0
    };

    await AlertsBulletinsModel.create(bulletinData);
    const alerts = await AlertsBulletinsModel.getAll();
    res.status(201).json(alerts[alerts.length - 1]); // Return the newly created alert
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
