api/static -> é apenas para produção, copiar os arquivos do front, quando for buildado 

Camada  / Responsável   / Exemplo prático
routes/	Define o caminho e responde com JSON	/api/usuarios chama usuario_service.listar_todos()

services/	Processa dados, aplica lógica de negócio	Busca no banco, faz cálculos, etc

models/	Define o banco de dados (ORM)	Tabelas, classes com SQLAlchemy

auth/	Gera/verifica tokens JWT ou login	auth_bp.route('/login')