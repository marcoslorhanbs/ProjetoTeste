const passport = require("passport/lib");
const User = require("../model/user");
const neo4j = require("../data/neo4j");

//list users get('/user')
const getUsers = async (errCalback) => {
  try {
    const users = await User.find().sort({ createdAt: "descending" });
    return users;
  } catch (err) {
    errCalback(err);
  }
};

const createNodeUser = async (username) => {
  const session = neo4j.session({ database: "neo4j" });
  await session.run(`CREATE (p:Pessoa {username:"${username}"})`);
  await session.close();
};
//register
const createUser = async (userdata, errorCalback) => {
  try {
    const user = await User.findOne({ email: userdata.email });
    if (user) {
      return false;
    }
    const newUser = new User({
      ...userdata,
    });
    newUser.save().then(async () => {
      createNodeUser(userdata.username);
    });
    return true;
  } catch (err) {
    errorCalback(err);
  }
};
const updateNodeUsername = (originalName, newName) => {
  if (originalName != newName) {
    const session = neo4j.session();
    session.run(
      `MATCH (p:Pessoa {username: "${originalName}"}) SET p.username = "${newName}"`
    );
  }
};

//edite update post('/edite')
const update = (req, errorCalback) => {
  const originalName = req.user.username;
  req.user.username = req.body.username;
  req.user.age = req.body.age;
  req.user.address = {
    city: req.body.city,
    road: req.body.road,
    district: req.body.district,
    zip: req.body.zip,
  };
  req.user.save(function (err) {
    if (err) {
      errorCalback(err);
      return;
    }
    updateNodeUsername(originalName, req.user.username);
  });
};

const getUserInfo = async (username, errCalback) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return null;
    }
    const session = neo4j.session();
    const result = await session.run(
      `MATCH (p:Pessoa {username:"${username}"})-[r:DOOU]->(p2:Pessoa) RETURN p2.username, r.date`
    );
    const persons = (result.records || []).map((obj) => {
      return { username: obj._fields[0], date: obj._fields[1] };
    });
    session.close();
    return { user: user, donors: persons };
  } catch (err) {
    errCalback(err);
  }
};

//delet delete post('/delete')
const deleteUser = async (id, email, errCalback) => {
  try {
    return await User.deleteOne({ _id: id, email: email });
  } catch (err) {
    errCalback(err);
  }
};

//criando relacionamento get('/users/:username1/donate/:username2')
const createDonate = async (user1, user2, errCalback) => {
  try {
    const session = neo4j.session();
    const result = await session.run(
      `MATCH (p1:Pessoa{username:"${user1}"})` +
        `OPTIONAL MATCH (p2:Pessoa{username:"${user2}"})` +
        ` CREATE (p1)-[:DOOU {date:date()}]->(p2) ` +
        `RETURN p2`
    );
    await session.close();
    if (result.summary.counters._stats.relationshipsCreated > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    errCalback(err);
  }
};

module.exports = {
  getUsers,
  createUser,
  update,
  deleteUser,
  createDonate,
  getUserInfo,
};
