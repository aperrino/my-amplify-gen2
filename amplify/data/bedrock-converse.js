export function request(ctx) {
    const system = JSON.parse(ctx.args.system) || [];
    const messages = JSON.parse(ctx.args.messages) || [];
  
    const body = {
      inferenceConfig: {
        maxTokens: 4096,
        temperature: 0.5
      },
      messages
    };
    if (system.length > 0) {
      body.system = system;
    }
  
    return {
      resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/converse`,
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body
      },
    };
  }
  
  export function response(ctx) {
    return {
      body: ctx.result.body,
    };
  }