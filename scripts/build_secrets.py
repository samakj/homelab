import os
import sys
import subprocess
import pkg_resources

try:
    import pip
except:
    subprocess.run(['apt', 'install', 'python3-pip'])

try:
    import yaml
except:
    subprocess.run([sys.executable, '-m', 'pip', 'install', 'pyyaml', '--break-system-packages'])
    import yaml

secrets_files = [
    "authelia",
    "cloudflare",
    "hosts",
    "iot_db",
    "ota",
    "pihole",
    "portainer",
    "proxmox",
    "router",
    "traefik",
    "truenas",
    "wifi",
]

working_dir = os.getcwd()
script_dir = os.path.dirname(os.path.realpath(__file__))

secrets = {
    "root_dir": "/".join(script_dir.split("/")[:-1])
}

def build_secrets(obj, prefix):
    for key, value in obj.items():
        if type(value) is dict:
            build_secrets(value, f"{prefix}.{key}")
        else:        
            secrets[f"{prefix}.{key}"] = value

for file in secrets_files:
    with open(f"{script_dir}/../config/{file}.secret.yml") as stream:
        try:
            build_secrets(yaml.safe_load(stream), file)
        except yaml.YAMLError as exc:
            print(exc)

input_file_path = sys.argv[1] if len(sys.argv) > 1 else None
output_file_path = sys.argv[2] if len(sys.argv) > 2 else None
escape_spaces = sys.argv[3] == "true" if len(sys.argv) > 3 else False

if input_file_path is None:
    print("No input file specified", file=sys.stderr)
    sys.exit()

if not input_file_path.startswith("/"):
    input_file_path = f"{working_dir}/{input_file_path}"

if not os.path.isfile(input_file_path):
    print(f"{input_file_path} doesnt exist")
    sys.exit()

if output_file_path is None:
    path_split = input_file_path.split("/")
    filename_split = path_split[-1].split(".")
    filename_split.insert(1, "secret")
    path_split[-1] = ".".join(filename_split)
    output_file_path = "/".join(path_split)
    print(f"No output file specified, using '{output_file_path}'")
elif not output_file_path.startswith("/"):
    output_file_path = f"{working_dir}/{output_file_path}"

if os.path.isfile(output_file_path):
    os.remove(output_file_path)


with open(input_file_path) as input_file:
    output = input_file.read()

    for key, value in secrets.items():
        output = output.replace(f"{{{{ {key} }}}}", str(value) if not escape_spaces else str(value).replace(" ", "\\ "))
    
    with open(output_file_path, "w") as output_file:
        output_file.write(output)
