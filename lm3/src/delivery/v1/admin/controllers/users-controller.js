const BaseController = rootRequire('delivery/lib/base-controller');

const { BadParamsError } = rootRequire('errors');

const { User } = rootRequire('models');

/**
 * UserController.
 *
 * Provides an API to the User model from an admin panel.
 */
class UserController extends BaseController {
  constructor(app, options) {
    super(app, options);

    this.list = this.list.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  /**
   * Returns all existing Users from the database
   *
   * @param   {Request}   req    The express Request object
   * @param   {Response}  res    The express Response object
   * @param   {Function}  next   The express middleware callback function
   * @return  {undefined}
   */
  async list(req, res, next) {
    const { Users } = this.api;

    try {
      const { users, count } = await Users.listForAdmin();

      res.json({ users, count });
    }
    catch (error) {
      next(error);
    }
  }

  /**
   * Finds User document with the id
   *
   * @param   {String}  id  The id of the User should be returned
   * @return  {Promise}     The promise will be resolved with found user
   */
  async findById(id) {
    return await User.findById(id);
  }

  /**
   * Creates a new User
   *
   * @param   {Request}   req    The express Request object
   * @param   {Response}  res    The express Response object
   * @param   {Function}  next   The express middleware callback function
   * @return  {undefined}
   */
  async create(req, res, next) {
    const { Users } = this.api;
    let user = new User(req.body);

    try {
      user = await Users.create(user);
      res.json(user);
    }
    catch (error) {
      next(error);
    }
  }

  /**
   * Updates an existing User
   *
   * @param   {Request}   req    The express Request object
   * @param   {Response}  res    The express Response object
   * @param   {Function}  next   The express middleware callback function
   * @return  {undefined}
   */
  async update(req, res, next) {
    const { Users } = this.api;
    const { entity, body } = req;

    try {
      const user = await Users.update(entity, body);
      res.json(user);
    }
    catch (error) {
      next(error);
    }
  }

  /**
   * Deletes an existing User from the database
   *
   * @param   {Request}   req    The express Request object
   * @param   {Response}  res    The express Response object
   * @param   {Function}  next   The express middleware callback function
   * @return  {undefined}
   */
  async destroy(req, res, next) {
    const { user, entity } = req;

    if (user.id === entity.id) {
      return next(new BadParamsError('bad_request', 'An attempt to delete yourself'));
    }

    try {
      await User.destroy({ where: { id: entity.id } });
      res.end();
    }
    catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
