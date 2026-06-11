import express from 'express';
import authRoutes from './auth';
import homeRoutes from './home';
import aboutRoutes from './about';
import investorEducationRoutes from './investor-education';
import portalsRoutes from './portals';
import alertsBulletinsRoutes from './alerts-bulletins';
import programsRoutes from './programs';
import publicationsRoutes from './publications';
import globalPolicyAreasRoutes from './global-policy-areas';
import glossaryRoutes from './glossary';
import feedbackRoutes from './feedback';
import adminRoutes from './admin';
import uploadRoutes from './upload';
import siteContentRoutes from './site-content';
import benchmarkingRoutes from './benchmarking';
import reorderRoutes from './reorder';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/home', homeRoutes);
router.use('/about', aboutRoutes);
router.use('/investor-education', investorEducationRoutes);
router.use('/portals', portalsRoutes);
router.use('/alerts-bulletins', alertsBulletinsRoutes);
router.use('/programs', programsRoutes);
router.use('/publications', publicationsRoutes);
router.use('/global-policy-areas', globalPolicyAreasRoutes);
router.use('/glossary', glossaryRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);
router.use('/site-content', siteContentRoutes);
router.use('/benchmarking', benchmarkingRoutes);
router.use('/reorder', reorderRoutes);

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'UASA Investor Education Portal API is running'
  });
});

export default router;
