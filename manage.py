#!/usr/bin/env python3
import os
import sys
import subprocess
import platform

def run_command(command, use_sudo=False):
    """Runs a shell command."""
    if use_sudo and platform.system() != "Windows":
        command = f"sudo {command}"

    print(f"\nExecuting: {command}")
    try:
        subprocess.run(command, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
        sys.exit(0)

def is_docker_sudo_needed():
    """Checks if sudo is needed to run docker commands."""
    if platform.system() == "Windows":
        return False
    try:
        # Check if we can run docker info without sudo
        subprocess.run(["docker", "info"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return False
    except (subprocess.CalledProcessError, FileNotFoundError):
        return True

def get_docker_compose_cmd():
    """Returns the docker compose command."""
    # Modern docker compose is 'docker compose', older standalone is 'docker-compose'
    # We'll assume 'docker compose' as per the project files, but we could add a check.
    return "docker compose"

def dev(use_sudo):
    print("\nStarting Development Mode...")
    cmd_prefix = get_docker_compose_cmd()

    print("Stopping containers...")
    run_command(f"{cmd_prefix} -f docker-compose.dev.yml down", use_sudo)

    print("Building image...")
    run_command(f"{cmd_prefix} -f docker-compose.dev.yml build", use_sudo)

    print("Starting containers...")
    run_command(f"{cmd_prefix} -f docker-compose.dev.yml up", use_sudo)

def dev_clean(use_sudo):
    print("\nStarting Development Mode (Clean Build)...")
    cmd_prefix = get_docker_compose_cmd()

    print("Cleaning containers and volumes...")
    run_command(f"{cmd_prefix} -f docker-compose.dev.yml down -v", use_sudo)

    print("Building image from scratch...")
    run_command(f"{cmd_prefix} -f docker-compose.dev.yml build --no-cache", use_sudo)

    print("Starting containers...")
    run_command(f"{cmd_prefix} -f docker-compose.dev.yml up", use_sudo)

def prod(use_sudo):
    print("\nStarting Production Mode...")
    cmd_prefix = get_docker_compose_cmd()

    print("Stopping containers...")
    run_command(f"{cmd_prefix} -f docker-compose.yml down", use_sudo)

    print("Building production image...")
    run_command(f"{cmd_prefix} -f docker-compose.yml build", use_sudo)

    print("Starting containers...")
    run_command(f"{cmd_prefix} -f docker-compose.yml up", use_sudo)

def main():
    use_sudo = is_docker_sudo_needed()
    if use_sudo:
        print("Note: Docker requires sudo on this system.")

    if len(sys.argv) > 1:
        choice = sys.argv[1].lower()
    else:
        print("\nOptions:")
        print("1. dev       - Start in development mode")
        print("2. dev-clean - Clean build and start in development mode")
        print("3. prod      - Start in production mode")
        choice = input("\nEnter your choice (dev/dev-clean/prod or 1/2/3): ").strip().lower()

    if choice in ["dev", "1"]:
        dev(use_sudo)
    elif choice in ["dev-clean", "2"]:
        dev_clean(use_sudo)
    elif choice in ["prod", "3"]:
        prod(use_sudo)
    else:
        print("Invalid option. Please choose 'dev', 'dev-clean', or 'prod'.")
        sys.exit(1)

if __name__ == "__main__":
    main()
