import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);
  
      // Define el pipeline
      const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
        pipelineName: 'CICD_Pipeline',
        crossAccountKeys: false,
      });
  
      // Obtener el secreto de GitHub desde Secrets Manager
      const githubToken = secretsmanager.Secret.fromSecretNameV2(this, 'GitHubToken', 'github/personal_access_token');
  
      // Agregar la etapa de origen con GitHub
      const sourceOutput = new codepipeline.Artifact();
      const sourceAction = new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub_Source',
        owner: 'NicoFuentesAP', // Reemplaza con tu usuario de GitHub
        repo: 'cicd_workshop', // Reemplaza con el nombre de tu repositorio
        branch: 'main', // Reemplaza con la rama que desees utilizar
        oauthToken: githubToken.secretValue,
        output: sourceOutput,
      });
  
      pipeline.addStage({
        stageName: 'Source',
        actions: [sourceAction],
      });
  
      // Añadir más etapas al pipeline aquí (e.g., Build, Deploy)
  
      // Crear una salida para la URL del pipeline
      new CfnOutput(this, 'PipelineConsoleUrl', {
        value: https://${cdk.Aws.REGION}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipeline.pipelineName}/view?region=${cdk.Aws.REGION},
      });
    }
  }