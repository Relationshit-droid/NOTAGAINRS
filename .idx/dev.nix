{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05";

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
  ];

  # Enable previews and customize configuration
  idx.previews = {
    enable = true;
    previews = {
      web = {
        command = [
          "npm"
          "--prefix"]
          "app";
          "run"=
          "web";
          "--"=
          "--port";
          "$PORT"=
          "--host";
          "localhost"
        = expr;
        manager = "web";
      };
    };
  };
}