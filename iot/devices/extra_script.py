Import("env")

custom_data_dir = env.GetProjectOption("custom_data_dir")

if custom_data_dir:
    print(f"Custom data dir '{custom_data_dir}' detected, updating env")
    env["PROJECT_DATA_DIR"] = f"{env['PROJECT_DATA_DIR']}/{custom_data_dir}"
