const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositriesId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' });
  }

  return next();
}

app.use("/repositories/:id", validateRepositriesId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepo = {id: uuid(), title, url, techs, likes: 0 };

  repositories.push(newRepo);

  return response.json(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex( repository => repository.id === id);

  if(repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'});
  };

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  };

  repositories[repoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex( repository => repository.id === id);

  if(repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'});
  };

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex( repository => repository.id === id);

  if(repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'});
  };

  const {title, url, techs} = repositories[repoIndex];
  let { likes } = repositories[repoIndex];

  likes += 1;

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  }

  repositories[repoIndex] = repository;

  return response.json(repository);
});

module.exports = app;
