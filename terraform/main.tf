provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "donare_sg" {
  name        = "donare_security_group"
  description = "Permite SSH, Backend e Frontend"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["SEU-IP/32"] # Alterar ip se precisar de acesso SSH
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "donare_key" {
  key_name   = "donare-key"
  public_key = file("~/.ssh/id_rsa.pub")
}

resource "aws_instance" "donare_server" {
  ami             = "ami-0fa3fe0fa7920f68e"
  instance_type   = "t3.micro"
  key_name        = aws_key_pair.donare_key.key_name
  security_groups = [aws_security_group.donare_sg.name]
  user_data       = file("user_data.sh")
}

output "ip_acesso" {
  value = aws_instance.donare_server.public_ip
}