# 1. Define the Cloud Provider
provider "aws" {
  region = "us-east-1" # You can change this to your preferred region
}

# 2. Create the Virtual Private Cloud (VPC)
resource "aws_vpc" "knowledge_nest_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "KnowledgeNest-VPC"
  }
}

# 3. Create a Public Subnet inside the VPC
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.knowledge_nest_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true # Ensures the EC2 gets a public IP
  availability_zone       = "us-east-1a"

  tags = {
    Name = "KnowledgeNest-Public-Subnet"
  }
}

# 4. Create an Internet Gateway to connect the VPC to the outside world
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.knowledge_nest_vpc.id

  tags = {
    Name = "KnowledgeNest-IGW"
  }
}

# 5. Create a Route Table to direct traffic to the Internet Gateway
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.knowledge_nest_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

# Associate the Route Table with our Subnet
resource "aws_route_table_association" "public_rt_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

# 6. Create the Security Group (Firewall)
resource "aws_security_group" "k8s_sg" {
  name        = "knowledge-nest-k8s-sg"
  description = "Allow SSH, HTTP, and K8s traffic"
  vpc_id      = aws_vpc.knowledge_nest_vpc.id

  # Allow SSH from anywhere (For Ansible)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow HTTP web traffic (For the React Frontend)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic to the internet (For downloading Docker images)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 7. Fetch the latest Ubuntu 22.04 Image automatically
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Official Canonical Ubuntu AWS account ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# 8. Provision the EC2 Instance
resource "aws_instance" "k8s_node" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.medium" # Minimum required to comfortably run Kubernetes
  subnet_id     = aws_subnet.public_subnet.id
  
  # Attach the Security Group
  vpc_security_group_ids = [aws_security_group.k8s_sg.id]

  # NOTE: You MUST create an SSH key pair in your AWS Console named "deploy-key"
  # or change this to the name of a key you already own.
  key_name = "deploy-key" 

  tags = {
    Name = "KnowledgeNest-K8s-Cluster"
  }
}

# 9. Output the Public IP to the terminal so we can easily use it for Ansible
output "ec2_public_ip" {
  description = "The public IP of the Kubernetes Node"
  value       = aws_instance.k8s_node.public_ip
}