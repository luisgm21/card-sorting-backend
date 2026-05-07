import UserService from '../services/UserService.mjs';

const UserController = {
  /**
   * GET /api/users/profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await UserService.getProfile(req.user.id);
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/users/:id
   */
  async getUserById(req, res, next) {
    try {
      const user = await UserService.getProfile(req.params.id);
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/users/profile
   */
  async updateProfile(req, res, next) {
    try {
      const user = await UserService.updateProfile(req.user.id, req.body);
      res.json({
        success: true,
        message: 'Perfil actualizado correctamente',
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/users (admin)
   */
  async listUsers(req, res, next) {
    try {
      const { role, isActive } = req.query;
      const filters = {};
      if (role) filters.role = role;
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const result = await UserService.listUsers(filters);
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/users/:id/deactivate (admin)
   */
  async deactivateUser(req, res, next) {
    try {
      const user = await UserService.deactivateUser(req.params.id);
      res.json({
        success: true,
        message: 'Usuario desactivado correctamente',
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/users/:id (admin)
   */
  async deleteUser(req, res, next) {
    try {
      const result = await UserService.deleteUser(req.params.id);
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
};

export default UserController;
