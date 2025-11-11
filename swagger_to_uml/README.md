# Swagger to UML

Obtained from this [repo](https://github.com/nlohmann/swagger_to_uml).

# How to use

Execute this, step by step:

1. Execute the API in dev mode in order to generate the swagger docs by running `pnpm start:dev`. This will generate the file `swagger-spec.json`.
2. Install `poetry` in order to install dependencies to run `swagger_to_uml`. Execute `poetry install` at that directory. Note that in order to run the script, both `plantuml` and `graphviz` is required.
3. Then run `poetry run python swagger_to_uml.py ../swagger-spec.json > ../swagger.puml` to generate the input for `plantuml`.
4. Lastly just run `plantuml ./swagger.puml -tpng` to generate the `swagger.png` file. Magic (thanks to [nlohmann](https://github.com/nlohmann/swagger_to_uml)).